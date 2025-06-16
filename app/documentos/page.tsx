"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardLayout from "../../components/layout/dashboard-layout"
import { FileText, Download, Eye } from "lucide-react"

export default function DocumentosPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Documentos</h1>
        <p className="text-muted-foreground">Gerencie seus documentos</p>
      </div>

      <div className="grid gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Documento #{i} - Relatório Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Atualizado em: 15/05/2025</p>
                  <p className="text-sm text-muted-foreground">Tamanho: 2.4 MB</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
